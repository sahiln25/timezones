export function setRecords(records) {
    const action = {
        type: 'SET_RECORDS',
        records
    };
    return action;
}
export function showCreateRecordForm(creatingRecord) { //toggles showing/hiding the create record form.
    const action = {
        type: 'SET_CREATING_RECORD',
        creatingRecord
    };
    return action;
}