'use client'

import { useState, useEffect, useTransition } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Download, Search } from 'lucide-react'

// This would be a proper type definition, likely shared from the backend
interface Job {
  id: string;
  title: string;
  location: string | null;
  postedAt: string;
  company: {
    name: string;
  };
}

const JobsClient = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [jobs, setJobs] = useState<Job[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState(searchParams.get('query') || '')

  const page = Number(searchParams.get('page')) || 1

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const fetchUrl = `/api/jobs?${params.toString()}`

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setJobs(data.data)
          setTotalPages(data.pagination.totalPages)
        }
      })
  }, [searchParams])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    params.set('query', query)
    params.set('page', '1')
    startTransition(() => {
      router.push(`/jobs?${params.toString()}`)
    })
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    startTransition(() => {
      router.push(`/jobs?${params.toString()}`)
    })
  }

  const handleExport = () => {
    const headers = ['Title', 'Company', 'Location', 'Posted Date']
    const rows = jobs.map(job => [
      `"${job.title}"`,
      `"${job.company.name}"`,
      `"${job.location || 'N/A'}"`,
      new Date(job.postedAt).toLocaleDateString(),
    ].join(','))

    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'jobs.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="glass rounded-lg p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <form onSubmit={handleSearch} className="w-full md:max-w-sm relative">
          <Input
            type="search"
            placeholder="Search jobs, companies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </form>
        <Button onClick={handleExport} variant="outline" className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Posted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{job.location || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>{new Date(job.postedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={4} className="text-center">No jobs found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default JobsClient
