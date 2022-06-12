const componentsOperation:any = {
  input: [
    { label: '等于', value: '=' },
    { label: '不等于', value: '!=' },
    { label: '大于', value: '>' },
    { label: '大于等于', value: '>=' },
    { label: '小于', value: '<' },
    { label: '小于等于', value: '<=' },
    { label: '包含', value: 'like' },
    { label: '不包含', value: 'no like' },
  ],
  select: [
    { label: '等于', value: '=' },
    { label: '不等于', value: '!=' },
    { label: '大于', value: '>' },
    { label: '大于等于', value: '>=' },
    { label: '小于', value: '<' },
    { label: '小于等于', value: '<=' },
    { label: '包含', value: 'like' },
    { label: '不包含', value: 'no like' },
  ],
  radio: [
    { label: '等于', value: '=' },
    { label: '不等于', value: '!=' },
    { label: '大于', value: '>' },
    { label: '大于等于', value: '>=' },
    { label: '小于', value: '<' },
    { label: '小于等于', value: '<=' },
    { label: '包含', value: 'like' },
    { label: '不包含', value: 'no like' },
  ],
  checkbox: [
    { label: '等于', value: '=' },
    { label: '不等于', value: '!=' },
    { label: '大于', value: '>' },
    { label: '大于等于', value: '>=' },
    { label: '小于', value: '<' },
    { label: '小于等于', value: '<=' },
    { label: '包含', value: 'like' },
    { label: '不包含', value: 'no like' },
  ],
  toggle: [
    { label: '等于', value: '=' },
    { label: '不等于', value: '!=' },
    { label: '大于', value: '>' },
    { label: '大于等于', value: '>=' },
    { label: '小于', value: '<' },
    { label: '小于等于', value: '<=' },
    { label: '包含', value: 'like' },
    { label: '不包含', value: 'no like' },
  ],
  btnToggle: [
    { label: '等于', value: '=' },
    { label: '不等于', value: '!=' },
    { label: '大于', value: '>' },
    { label: '大于等于', value: '>=' },
    { label: '小于', value: '<' },
    { label: '小于等于', value: '<=' },
    { label: '包含', value: 'like' },
    { label: '不包含', value: 'no like' },
  ],
  optionGroup: [
    { label: '等于', value: '=' },
    { label: '不等于', value: '!=' },
    { label: '大于', value: '>' },
    { label: '大于等于', value: '>=' },
    { label: '小于', value: '<' },
    { label: '小于等于', value: '<=' },
    { label: '包含', value: 'like' },
    { label: '不包含', value: 'no like' },
  ],
  range: [
    { label: '等于', value: '=' },
    { label: '不等于', value: '!=' },
    { label: '大于', value: '>' },
    { label: '大于等于', value: '>=' },
    { label: '小于', value: '<' },
    { label: '小于等于', value: '<=' },
    { label: '包含', value: 'like' },
    { label: '不包含', value: 'no like' },
  ],
  time: [
    { label: '等于', value: '=' },
    { label: '不等于', value: '!=' },
    { label: '大于', value: '>' },
    { label: '大于等于', value: '>=' },
    { label: '小于', value: '<' },
    { label: '小于等于', value: '<=' },
    { label: '包含', value: 'like' },
    { label: '不包含', value: 'no like' },
  ],
  date: [
    { label: '等于', value: '=' },
    { label: '不等于', value: '!=' },
    { label: '大于', value: '>' },
    { label: '大于等于', value: '>=' },
    { label: '小于', value: '<' },
    { label: '小于等于', value: '<=' },
    { label: '包含', value: 'like' },
    { label: '不包含', value: 'no like' },
  ],
};
export const getComponentsByType = (name:string) => componentsOperation[name || 'input'];
