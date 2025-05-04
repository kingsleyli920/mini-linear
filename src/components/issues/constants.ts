const STATUS_LIST = [
  'in progress',
  'todo',
  'backlog',
  'done',
  'canceled',
  'duplicate',
];
export const MOCK_ISSUES = Array.from({ length: 30 }).map((_, i) => {
  const status = STATUS_LIST[i % STATUS_LIST.length];
  return {
    id: (i + 1).toString(),
    serial: `KIN-${i + 1}`,
    title: `Mock Issue Title ${i + 1}`,
    description: '',
    status,
    created_at: '2024-05-02T00:00:00Z',
    updated_at: '2024-05-02T00:00:00Z',
  };
});
