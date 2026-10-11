import CrudManager from '../../components/CrudManager';
import { areas, selectAreas } from '../../features/areas/areasSlice';

const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'country', label: 'Country', required: true },
  { name: 'description', label: 'Description', multiline: true },
  { name: 'population', label: 'Population', type: 'number' },
  { name: 'latitude', label: 'Latitude', type: 'number', required: true },
  { name: 'longitude', label: 'Longitude', type: 'number', required: true },
];

export default function AdminAreas() {
  return (
    <CrudManager
      title="Manage affected areas"
      noun="area"
      selector={selectAreas}
      thunks={areas}
      fields={fields}
      empty={{ population: 0 }}
      columns={(a) => (
        <>
          <strong>{a.name}</strong>, {a.country}
        </>
      )}
    />
  );
}
