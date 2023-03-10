import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { githubApi } from 'src/api/githubApi';
import { Label } from 'src/issues/interfaces/label';
import { useIssuesStore } from 'src/stores/issuesStore';

const getLabels = async (): Promise<Label[]> => {

    const { data } = await githubApi<Label[]>('/labels?per_page=100');
    return data;

}

const useLabels = () => {

    const issuesStore = useIssuesStore();
    const { labels: selectedLabels } = storeToRefs(issuesStore);
    const { toggleLabel } = issuesStore;

    const { data, isLoading } = useQuery(
        ['labels'],
        getLabels,
        {
            staleTime: 1000 * 60 * 60, // una hora
        }
    );

    return {
        data,
        isLoading,

        //Getters
        selectedLabels,
        // selectedLabels: computed( () => issuesStore.labels ),

        //Methods
        toggleLabel
    }
}

export default useLabels;

