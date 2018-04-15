import pull from 'lodash.pull';
import clone from 'lib/clone';

// ----------------------------------------------------------- //
// fetchCommissions
// ----------------------------------------------------------- //

export function fetchCommissionsStart (state) {
  state.meta.commissions = {
    errored: false,
    mutating: true
  };
};

export function fetchCommissionsSuccess (state, json) {
  state.meta.commissions = {
    mutating: false,
    errored: false
  };
  state.commissions = json;
};

export function fetchCommissionsFailure (state, errors) {
  state.meta.commissions = {
    mutating: false,
    errored: true
  };
};

// ----------------------------------------------------------- //
// updateCommission
// ----------------------------------------------------------- //

export function updateCommissionStart (state) {
  state.meta.commissions = {
    errored: false,
    mutating: true
  };
};

export function updateCommissionSuccess (state, json) {
  state.meta.commissions = {
    mutating: false,
    errored: false
  };

  state.commissions = clone(state.commissions);
  pull(state.commissions, { id: json.id });
  state.commissions.push(json);
};

export function updateCommissionFailure (state, errors) {
  state.meta.commissions = {
    mutating: false,
    errored: true
  };
};
