import { useQuery } from '@tanstack/vue-query';
// import { storeToRefs } from 'pinia';
import { githubApi } from 'src/api/githubApi';
import { Issue } from 'src/issues/interfaces/issue';
import { State } from 'src/issues/interfaces/issue';
import useStore from './useStore';

const getIssues = async (labels: string[], state: State): Promise<Issue[]> => {

    //De esta forma añado tantos queries parametes como necesite
    const params = new URLSearchParams();

    if (state) params.append('state', state);
    if (labels.length > 0) {
        const labelsString = labels.join(',');
        params.append('labels', labelsString);
    }

    params.append('per_page', '10');

    const { data } = await githubApi.get<Issue[]>('/issues', {
        params
    });

    return data;
}

const useIssues = () => {

    const { labels, state } = useStore()
    // const issuesStore = useIssuesStore();
    // const { labels, state } = storeToRefs(issuesStore);

    const issuesQuery = useQuery(
        //De esta forma mando referencia reactivas
        //con las {} para crear un objeto compuesto
        //sin importar el orden
        ['issues', { labels, state }],
        // (data) => { data.}
        () => getIssues(labels.value, state.value),
    )

    return {
        issuesQuery
    }
}

export default useIssues;

