'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Issue {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

export default function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchIssues() {
      try {
        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching issues:', error);
          return;
        }

        setIssues(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, []);

  if (loading) {
    return <div>Loading issues...</div>;
  }

  if (issues.length === 0) {
    return <div>No issues found.</div>;
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div
          key={issue.id}
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold">{issue.title}</h3>
          <p className="text-gray-600 mt-2">{issue.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {issue.status}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(issue.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
