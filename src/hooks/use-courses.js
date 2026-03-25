"use client";

import { useState, useEffect } from "react";

let cache = null;

export default function useCourses() {
  const [courses, setCourses] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;

    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        cache = data;
        setCourses(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading };
}
