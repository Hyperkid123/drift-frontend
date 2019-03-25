import types from './types';

const initialState = {
    fullCompareData: [],
    filteredCompareData: [],
    systems: [],
    addSystemModalOpened: false,
    selectedSystemIds: [],
    filterDropdownOpened: false,
    stateFilter: 'all',
    factFilter: '',
    totalFacts: 0,
    page: 1,
    sort: 'asc',
    perPage: 10,
    loading: false
};

function paginateData(data, selectedPage, factsPerPage) {
    let paginatedFacts = [];

    for (let i = 0; i < data.length; i++) {
        if (Math.ceil((i + 1) / factsPerPage) === selectedPage) {
            paginatedFacts.push(data[i]);
        }
    }

    return paginatedFacts;
}

function filterCompareData(data, stateFilter, factFilter) {
    let filteredFacts = [];

    for (let i = 0; i < data.length; i += 1) {
        if (data[i].name.includes(factFilter)) {
            if (stateFilter.toLowerCase() === 'all' || stateFilter === undefined) {
                filteredFacts.push(data[i]);
            }
            else if (stateFilter === data[i].state) {
                filteredFacts.push(data[i]);
            }
        }
    }

    return filteredFacts;
}

function sortData(filteredFacts, sort) {
    if (sort === 'asc') {
        filteredFacts.sort(function(a, b) {
            if (a.name > b.name) {
                return 1;
            }
            else if (a.name < b.name) {
                return -1;
            }
            else {
                return 0;
            }
        });
    }
    else if (sort === 'desc') {
        filteredFacts.sort(function(a, b) {
            if (b.name > a.name) {
                return 1;
            }
            else if (b.name < a.name) {
                return -1;
            }
            else {
                return 0;
            }
        });
    }

    return filteredFacts;
}

function selectedSystems(selectedIds, selectedSystem) {
    let id = selectedSystem.id;

    if (selectedSystem.selected && !selectedIds.includes(id)) {
        selectedIds.push(id);
    } else if (!selectedSystem.selected) {
        selectedIds = selectedIds.filter(item => item !== id);
    }

    return selectedIds;
}

function compareReducer(state = initialState, action) {
    let filteredFacts;
    let sortedFacts;
    let paginatedFacts;

    switch (action.type) {
        case `${types.FETCH_COMPARE}_PENDING`:
            return {
                ...state,
                filteredCompareData: [],
                systems: [],
                loading: true
            };
        case `${types.FETCH_COMPARE}_FULFILLED`:
            filteredFacts = filterCompareData(action.payload.facts, state.stateFilter, state.factFilter);
            sortedFacts = sortData(filteredFacts, state.sort);
            paginatedFacts = paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                loading: false,
                fullCompareData: action.payload.facts,
                filteredCompareData: paginatedFacts,
                systems: action.payload.systems,
                selectedSystemIds: action.payload.systems.map(system => system.id),
                page: 1,
                totalFacts: filteredFacts.length
            };
        case 'SELECT_ENTITY':
            return {
                ...state,
                selectedSystemIds: selectedSystems([ ...state.selectedSystemIds ], action.payload)
            };
        case `${types.UPDATE_PAGINATION}`:
            filteredFacts = filterCompareData(state.fullCompareData, state.stateFilter, state.factFilter);
            sortedFacts = sortData(filteredFacts, state.sort);
            paginatedFacts = paginateData(sortedFacts, action.payload.page, action.payload.perPage);
            return {
                ...state,
                page: action.payload.page,
                perPage: action.payload.perPage,
                filteredCompareData: paginatedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.FILTER_BY_STATE}`:
            filteredFacts = filterCompareData(state.fullCompareData, action.payload, state.factFilter);
            sortedFacts = sortData(filteredFacts, state.sort);
            paginatedFacts = paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                stateFilter: action.payload,
                page: 1,
                filteredCompareData: paginatedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.FILTER_BY_FACT}`:
            filteredFacts = filterCompareData(state.fullCompareData, state.stateFilter, action.payload);
            sortedFacts = sortData(filteredFacts, state.sort);
            paginatedFacts = paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                factFilter: action.payload,
                page: 1,
                filteredCompareData: paginatedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.TOGGLE_FACT_SORT}`:
            filteredFacts = filterCompareData(state.fullCompareData, state.stateFilter, state.factFilter);
            sortedFacts = sortData(filteredFacts, action.payload);
            paginatedFacts = paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                page: 1,
                sort: action.payload,
                filteredCompareData: paginatedFacts,
                totalFacts: filteredFacts.length
            };

        default:
            return {
                ...state
            };
    }
}

function addSystemModalReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.OPEN_ADD_SYSTEM_MODAL}`:
            return {
                ...state,
                addSystemModalOpened: !state.addSystemModalOpened
            };

        default:
            return {
                ...state
            };
    }
}

function filterDropdownReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.OPEN_FILTER_DROPDOWN}`:
            return {
                ...state,
                filterDropdownOpened: !state.filterDropdownOpened
            };

        default:
            return {
                ...state
            };
    }
}

export default {
    compareReducer,
    addSystemModalReducer,
    filterDropdownReducer
};