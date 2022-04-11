export default {
  definitions: {
    'user-inventory': {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        },
        userId: {
          type: 'string'
        },
        inventoryItemId: {
          type: 'string'
        },
        quantity: {
          type: 'integer'
        },
        addedOn: {
          type: 'date'
        }
      }
    },
    'user-inventory_list': {
      type: 'array',
      items: { $ref: '#/definitions/user-inventory' }
    }
  }
}
