import { useIssuesStore } from 'src/stores/issuesStore';
import { storeToRefs } from 'pinia';


const useStore = () => {

    const issuesStore = useIssuesStore();
    const { labels, state } = storeToRefs(issuesStore);


    return {
        //Reactive properties
        labels, state,

        //Getters

        //Actions
    }
}

export default useStore;

