<script setup lang="ts">
import { ref } from 'vue';
import LoaderSpinner from 'src/shared/components/LoaderSpinner.vue';
import FilterSelector from 'src/issues/components/FilterSelector.vue';
import IssueList from 'src/issues/components/issue-list/IssueList.vue';
import useIssues from 'src/issues/composables/useIssues';
import FloatingButtons from 'src/issues/components/FloatingButtons.vue';
import NewIssueDialog from 'src/issues/components/NewIssueDialog.vue';
import useLabels from 'src/issues/composables/useLabels';

const { issuesQuery } = useIssues();
const { data } = useLabels();

const isOpen = ref<boolean>(false);


const openDialog = () => {
    isOpen.value = true;
}

</script>


<template>
    <div class="row q-mb-md q-mt-md">
        <div class="col-12">
            <span class="text-h4">GitHub Issued</span>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12 col-md-4">
            <FilterSelector />
        </div>
        <div class="col-xs-12 col-md-8">

            <LoaderSpinner v-if="issuesQuery.isLoading.value" />

            <IssueList v-else :issues="issuesQuery.data?.value || []" />

        </div>
    </div>

    <!-- Floating Buttons -->
    <FloatingButtons :buttons="[
        {
            icon: 'add',
            color: 'primary',
            size: 'md',
            action: openDialog
        },
    ]" />

    <!-- Dialog New Issue -->
    <NewIssueDialog v-if="data" :is-open="isOpen" :labels="data?.map(label => label.name) || []"
        @on-close="isOpen = false" />
</template>


<style scoped></style>