'use client'

import clsx from "clsx"
import { type AssignmentWithUsers } from "@/lib/exchanges"

interface Props {
  assignments: AssignmentWithUsers[]
  handleGenerateMatchesAction: () => void
  canGenerate: boolean
}

export default function ExchangeAssignments({ assignments, handleGenerateMatchesAction, canGenerate }: Props) {
  return (
    <div className="w-full mt-6" data-testid="exchange-assignments">
      <header className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Assignments</h2>
        <button
          className={clsx(
            'p-2 px-4 border rounded-md text-sm uppercase font-bold text-white no-underline', {
              'bg-black hover:bg-blue-600 cursor-pointer': canGenerate,
              'bg-black/40 cursor-not-allowed': !canGenerate,
            }
          )}
          onClick={() => handleGenerateMatchesAction()}
          disabled={!canGenerate}
        >
          Generate matches
        </button>
      </header>
      {assignments && assignments.length > 0 ? (
        <ul className="w-full mb-4" data-testid="assignments-list">
          {assignments.map((assignment) => (
            <li key={assignment.id} className="flex items-center py-1 mb-1 border-b border-b-black/10">
              <span className="font-bold truncate max-w-[120px]">{assignment.giver.user.name}</span>
              <span className="mx-2">gives to</span>
              <span className="font-bold">{assignment.receiver.user.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assignments found.</p>
      )}
    </div>
  )
}
