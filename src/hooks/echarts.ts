import * as echarts from 'echarts/core';
import {
    BarChart,
    BarSeriesOption,
    LineChart,
    LineSeriesOption,
    PieChart,
    CandlestickChart,
    RadarChart,
    ScatterChart,
} from 'echarts/charts';
import {
    TitleComponent,
    // 组件类型的定义后缀都为 ComponentOption
    TitleComponentOption,
    TooltipComponent,
    TooltipComponentOption,
    GridComponent,
    GridComponentOption,
    // 数据集组件
    DatasetComponent,
    DatasetComponentOption,
    // 内置数据转换器组件 (filter, sort)
    TransformComponent,

    LegendComponent,
    LegendComponentOption,

    ToolboxComponent,
    ToolboxComponentOption,

    PolarComponent,
    PolarComponentOption,

} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { Ref } from 'vue';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
  | LegendComponentOption
  | ToolboxComponentOption
  | PolarComponentOption
  >;

// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    BarChart,
    LineChart,
    LabelLayout,
    PieChart,
    UniversalTransition,
    CanvasRenderer,
    LegendComponent,
    ToolboxComponent,
    CandlestickChart,
    RadarChart,
    ScatterChart,
    PolarComponent,
]);

export const useEcharts = (el:Ref<HTMLElement|null>, options:ECOption) => {
    if (el.value) {
        const myChart = echarts.init(el.value);
        myChart.setOption(options);
    }
};
