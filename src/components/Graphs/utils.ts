const average = (ctx: any) => {
  const values = ctx.chart.data.datasets[0]?.data || [];
  return values.reduce((a: string, b: string) => Number(a) + Number(b), 0) / values.length;
};

export const getAverageAnnotation = (type: string) => {
  const append = type === 'cpu' ? '%' : 'MiB';
  return {
    borderColor: 'black',
    borderDash: [6, 6],
    borderDashOffset: 0,
    borderWidth: 2,
    label: {
      content: (ctx: any) => `Average: ${average(ctx).toFixed(2)} ${append}`,
      position: 'end',
      backgroundColor: 'red',
      display: true,
    },
    scaleID: 'y',
    value: (ctx: any) => average(ctx),
  };
};
