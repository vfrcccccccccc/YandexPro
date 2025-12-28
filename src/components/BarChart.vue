<!-- src/components/BarChart.vue -->

<template>
  <Bar :data="data" :options="options" />
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// register chart.js components once
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);

export default defineComponent({
  name: 'BarChart',
  components: { Bar },
  props: {
    data: {
      type: Object as PropType<ChartData<'bar'>>,
      required: true,
    },
    options: {
      type: Object as PropType<ChartOptions<'bar'>>,
      required: false,
      default: () => ({}) as ChartOptions<'bar'>,
    },
  },
});
</script>
