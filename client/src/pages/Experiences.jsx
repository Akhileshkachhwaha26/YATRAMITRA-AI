import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import api from '../services/api';
import ExperienceCard from '../components/cards/ExperienceCard';
import { SkeletonGrid } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { EXPERIENCE_CATEGORIES } from '../utils/constants';

export default function Experiences() {
  const [params, setParams] = useSearchParams();
  const [experiences, setExperiences] = useState(null);
  const [error, setError] = useState(false);
  const category = params.get('category') || '';
  const sort = params.get('sort') || '';

  async function load() {
    setError(false);
    setExperiences(null);
    try {
      const query = {};
      const destination = params.get('destination');
      if (destination) query.destination = destination;
      if (category) query.category = category;
      if (sort) query.sort = sort;
      const { data } = await api.get('/experiences', { params: query });
      setExperiences(data.data);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
  }, [category, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold">Local experiences</h1>
      <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">
        Food tours, craft workshops, treks and more — hosted by local community members.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => updateParam('category', '')}
          className={`chip ${category === '' ? 'border-saffron-400 bg-saffron-500 text-brand-900' : ''}`}
        >
          All
        </button>
        {EXPERIENCE_CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => updateParam('category', c.value)}
            className={`chip ${category === c.value ? 'border-saffron-400 bg-saffron-500 text-brand-900' : ''}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {error && <ErrorState message="Couldn't load experiences." onRetry={load} />}
        {!error && !experiences && <SkeletonGrid count={9} />}
        {!error && experiences && experiences.length === 0 && (
          <EmptyState icon={Sparkles} title="No experiences found" description="Try a different category." />
        )}
        {!error && experiences && experiences.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((exp, i) => (
              <ExperienceCard key={exp._id} experience={exp} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
