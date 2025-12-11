import { ButtonGroup, ToggleButton } from 'react-bootstrap';

/**
 * RoleFilter - Accessible filter controls for the Work page
 * Allows filtering by role focus (all, Data Science, UI/UX)
 */
export default function RoleFilter({ selectedRole, onRoleChange }) {
  const roles = [
    { value: 'all', label: 'All Work' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'ui-ux', label: 'UI/UX' },
  ];

  return (
    <div className="role-filter mb-4">
      <label htmlFor="role-filter" className="visually-hidden">
        Filter work by role focus
      </label>
      <ButtonGroup
        id="role-filter"
        role="group"
        aria-label="Filter work by role focus"
      >
        {roles.map((role) => (
          <ToggleButton
            key={role.value}
            id={`role-${role.value}`}
            type="radio"
            variant="outline-primary"
            name="role-filter"
            value={role.value}
            checked={selectedRole === role.value}
            onChange={(e) => onRoleChange(e.currentTarget.value)}
            aria-pressed={selectedRole === role.value}
          >
            {role.label}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </div>
  );
}

