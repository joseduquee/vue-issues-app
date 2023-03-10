import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { githubApi } from 'src/api/githubApi';
import { Issue } from 'src/issues/interfaces/issue';
import { computed } from 'vue';

const sleep = (): Promise<boolean> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 2500);
    })
}

const getIssue = async (issueNumber: number): Promise<Issue> => {
    await sleep();
    const { data } = await githubApi.get<Issue>(`/issues/${issueNumber}`)
    return data;
}

const getIssueComments = async (issueNumber: number): Promise<Issue[]> => {
    await sleep();
    const { data } = await githubApi.get<Issue[]>(`/issues/${issueNumber}/comments`)
    return data;
}

interface Options {
    //Autoload issue and comments
    autoload?: boolean;
}

const useIssue = (issueNumber: number, options?: Options) => {

    const { autoload = true } = options || {};

    //Siemrpre tiene que estar dentro de un composable function o
    //dentro del script setup
    const queryClient = useQueryClient();

    const issueQuery = useQuery(
        ['issue', issueNumber],
        () => getIssue(issueNumber),
        {
            staleTime: 1000 * 20,
            enabled: autoload
        }
    );

    const issueCommentsQuery = useQuery(
        ['issue', issueNumber, 'comments'],
        () => getIssueComments(issueNumber),
        // () => getIssueComments(issueQuery.data.value?.number || 0),
        {
            staleTime: 1000 * 15, //15 segundo
            // enabled: computed(() => !!issueQuery.data.value)
            enabled: autoload
        }
    )

    const prefetchIssue = (issueNumber: number) => {
        queryClient.prefetchQuery(
            ['issue', issueNumber],
            () => getIssue(issueNumber),
            {
                staleTime: 1000 * 60
            }
        )
        queryClient.prefetchQuery(
            ['issue', issueNumber, 'comments'],
            () => getIssueComments(issueNumber),
            {
                staleTime: 1000 * 15, //15 segundo
            }
        )
    };

    const setIssueCacheData = (issue: Issue) => {
        queryClient.setQueryData(
            ['issue', issue.number],
            issue
        );
    }

    return {
        issueQuery,
        issueCommentsQuery,

        //Methods
        prefetchIssue,
        setIssueCacheData
    }
}

export default useIssue;

