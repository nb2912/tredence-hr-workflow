export const automations = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'notify_slack', label: 'Notify Slack', params: ['channel', 'message'] },
  { id: 'update_hris', label: 'Update HRIS', params: ['employeeId', 'field', 'value'] },
  { id: 'send_calendar_invite', label: 'Send Calendar Invite', params: ['to', 'date', 'title'] }
]

export const getAutomations = () => Promise.resolve(automations)
