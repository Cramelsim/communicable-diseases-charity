import CrudManager from '../../components/CrudManager';
import { diseases, selectDiseases } from '../../features/diseases/diseasesSlice';

const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'severity', label: 'Severity', options: ['low', 'moderate', 'high', 'critical'] },
  { name: 'description', label: 'Description', multiline: true, required: true },
  { name: 'symptoms', label: 'Symptoms', multiline: true },
  { name: 'transmission', label: 'Transmission', multiline: true },
  { name: 'prevention', label: 'Prevention', multiline: true },
  { name: 'treatment', label: 'Treatment', multiline: true },
];

export default function AdminDiseases() {
  return (
    <CrudManager
      title="Manage diseases"
      noun="disease"
      selector={selectDiseases}
      thunks={diseases}
      fields={fields}
      empty={{ severity: 'moderate' }}
      columns={(d) => (
        <>
          <strong>{d.name}</strong> <span className={`badge ${d.severity}`}>{d.severity}</span>
        </>
      )}
    />
  );
}
