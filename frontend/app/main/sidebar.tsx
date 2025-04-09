"use client";
import Link from 'next/link';

export default function Sidebar() {
    return (
      <aside className="w-64 h-screen bg-gray-200 p-4">
        <ul className="Sidebar">
          <li><Link href="/select" className="block p-2 hover:bg-gray-300">See All Characters</Link></li>
          <li><Link href="/add" className="block p-2 hover:bg-gray-300">Add Character</Link></li>
          <li><Link href="/charts" className="block p-2 hover:bg-gray-300">Charts</Link></li>
          <li><Link href="/bigFiles" className="block p-2 hover:bg-gray-300">BigFiles</Link></li>
          <li><Link href="/" className="block p-2 hover:bg-gray-300">Main Page</Link></li>
        </ul>
      </aside>
    );
  }