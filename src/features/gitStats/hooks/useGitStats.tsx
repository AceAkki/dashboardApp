import { useState, useEffect } from "react";
import { useShallow } from "zustand/shallow";

import { fetchData, dateFormat } from "@/global/globalFunctions";
import type { GitRepository, GitUser, GitStats, GitStatRes } from "../gitTypes";
import { useUserStore } from "../../auth/useAuthStore";
import { useGitStore } from "./useGitStore";

const CACHE_MS = 15 * 60 * 1000;

export const useGitStats = (): GitStatRes => {
  const { userID } = useUserStore(useShallow((s) => ({ userID: s.userID })));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { gitStatData, expiresAt, saveGitStats, invalidate } = useGitStore(
    useShallow((s) => ({
      gitStatData: s.gitStatData,
      expiresAt: s.expiresAt,
      saveGitStats: s.saveGitStats,
      invalidate: s.invalidate,
    })),
  );

  // wait for AsyncStorage to load the cache before deciding to fetch
  const [hydrated, setHydrated] = useState(useGitStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = useGitStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    setHydrated(useGitStore.persist.hasHydrated());
    return unsub;
  }, []);

  const fresh =
    gitStatData !== null && expiresAt !== null && expiresAt > Date.now();

  useEffect(() => {
    if (!hydrated || fresh) return;

    let active = true;
    setLoading(true);
    setError(null);

    Promise.all([getGitData(userID)])
      .then(([gitNewData]) => {
        if (!active) return;
        if (!gitNewData) {
          setError("Couldn't load userID. Check your connection.");
          return;
        }
        saveGitStats({
          gitStatData: gitNewData,
          expiresAt: Date.now() + CACHE_MS,
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userID, hydrated, fresh]);

  return {
    data: gitStatData,
    loading,
    error,
    storageTime: expiresAt,
    refetch: invalidate,
  };
};

export const getGitData = async (userid: string): Promise<GitStats | null> => {
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(userid)}`,
      {
        headers: {
          "User-Agent": "dashApp",
        },
      },
    );
    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }
    let userData: GitUser = await res.json();
    let reposDataArr = (await fetchData(userData.repos_url)) as GitRepository[];
    if (!reposDataArr) return null;
    let lastPushedRepo = reposDataArr
      .filter((repo) => Boolean(repo.pushed_at))
      .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))[0];
    let lastPushDate = dateFormat(lastPushedRepo.pushed_at);

    return {
      ...userData,
      lastPushedRepo: lastPushedRepo,
      lastPushDate: lastPushDate,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

/*

Almost all of those mistakes come from a few mental models. Here they are, with a habit to go with each.

**1. A hook is a function that must return something**
A hook is just a function the component calls, and the component only sees what it returns. Before writing the body, decide what the screen needs. For a fetching hook that's almost always three things: the data, whether it's loading, and the error. Write that return shape first, then fill in the body. The "no return value" bug comes from skipping this.

**2. State holds values, never Promises**
`useState` stores whatever you give it, immediately. An async function gives you a Promise right away, and the real data arrives later. So the Promise ends up in state and the data goes nowhere.

The pattern: start with an empty state (null), start the fetch inside an effect, and set the state when it finishes. Remember: *state starts empty, effects fetch, the result lands later.*

**3. Effects are for talking to the outside world**
Fetching, timers and subscriptions belong in `useEffect`. Computing something from existing state doesn't. The effect in your hook only compared state to itself. Ask whether the effect talks to something outside React. If not, you probably don't need one.

**4. The dependency list says when to re-run**
List everything the effect reads, here `userID`. That makes it refetch when the user changes. An empty list means "only once", which is wrong whenever an input can change.

**5. Async work finishes after things have changed**
Between starting a fetch and getting the answer, the component may unmount or the input may change. So every fetching effect needs cleanup: cancel the request, or ignore the result if it's stale. Ask what happens if this answer arrives late.

**6. `await` every async call, always**
If a function does I/O, assume it's async. Without `await` you get a Promise where you expected data, and the next line (`.map`) fails. The `catch` then hid the error, which is worse. Be careful with broad `try/catch` blocks that return `null`, because they turn bugs into silent "no data". At minimum, log the error and surface it as an error state.

**7. Check types and shapes before using them**
`b - a` on date strings gives `NaN`. TypeScript would have caught that if `fetchData` had a return type. Unknown types, or `any`, switch the safety off. Type your API responses, and test with the awkward cases: empty list, empty id, a 404.

**8. Think about edge cases before the happy path**
Before shipping any fetch, run through five cases:
- Empty input.
- Empty result.
- Not found (404).
- Rate limit or offline.
- Slow response.

Most of your gaps were in these.

**9. Mobile changes the cost of a request**
A web page loads once. A phone app mounts and unmounts screens constantly, and limited APIs like GitHub's 60 requests an hour are used up quickly. For anything fetched from a rate-limited API, cache it, and ask the API for only what you need.

**10. Naming is documentation**
A variable named `lastPushedRepo` that holds a date misleads you in six months. Name things for what they hold.

**A short checklist before you finish any data hook**
1. What does it return? (data, loading, error)
2. Is state empty at the start?
3. Is the fetch in an effect with the right dependencies?
4. Is every async call awaited?
5. Is there cleanup for stale or unmounted results?
6. What happens on empty, missing, failed and slow?

If you'd like practice, I can give you a few short exercises, or you can write your own version of this hook and I'll review it against this list.
*/
