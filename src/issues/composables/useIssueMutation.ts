import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { Issue } from 'src/issues/interfaces/issue';
import { githubApi } from '../../api/githubApi';

interface Args {
    title: string;
    labels?: string[];
    body?: string;
}

const addIssue = async ({ title, body = '', labels = [] }: Args): Promise<Issue> => {

    const newIssueData = { title, body, labels };

    const { data } = await githubApi.post<Issue>('/issues', newIssueData);
    console.log({ DataFromGitHub: data });

    return data;
}

const useIssueMutation = () => {

    const queryClient = useQueryClient();

    const issueMutation = useMutation(addIssue, {
        //Se invalida los queries para volver a cargar la información del backend
        // el exact es para que busque cualquier key que tenga issue
        onSuccess: (issue) => {
            queryClient.invalidateQueries({
                queryKey: ['isssues'],
                exact: false
            });

            queryClient.refetchQueries(
                ['issues'],
                {
                    exact: false
                }
            );

            queryClient.setQueryData(
                ['issue', issue.number],
                issue
            );


        },
        onSettled: () => {
            //ter con error o success
        }
    })

    return {
        issueMutation
    }
}

export default useIssueMutation;

