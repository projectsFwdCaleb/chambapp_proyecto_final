import React, { useState, useEffect } from 'react';
import ServicesJobs from '../../Services/ServicesJobs';
import './JobSuggestions.css';

function JobSuggestions({ initialQuery }) {
    const [query, setQuery] = useState(initialQuery || '');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchJobs = async (searchQuery) => {
        if (!searchQuery.trim() || loading) return;
        setLoading(true);
        setError(null);
        try {
            const results = await ServicesJobs.getJobSuggestions(searchQuery);
            setJobs(results);
        } catch (err) {
            setError("No se pudieron cargar las ofertas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialQuery) {
            searchJobs(initialQuery);
        }
    }, [initialQuery]);

    return (
        <div className="job-suggestions-container">
            <div className="job-search-bar">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ej. Plomero, Abogado..."
                    onKeyDown={(e) => e.key === 'Enter' && searchJobs(query)}
                />
                <button disabled={loading} onClick={() => searchJobs(query)}>
                    {loading ? "..." : "🔍"}
                </button>
            </div>

            <div className="job-list">
                {loading && <div className="job-loading">Buscando oportunidades... 💼</div>}

                {error && <div className="job-empty">{error}</div>}

                {!loading && jobs.length === 0 && !error && (
                    <div className="job-empty">Busca un empleo para ver ofertas.</div>
                )}

                {jobs.map((job, index) => (
                    <div key={index} className="job-card">
                        <div className="job-source">{job.source}</div>
                        <div className="job-title">{job.title}</div>
                        <div className="job-snippet">{job.snippet}</div>
                        <a href={job.link} target="_blank" rel="noopener noreferrer" className="job-link">
                            Ver Oferta →
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default JobSuggestions;
