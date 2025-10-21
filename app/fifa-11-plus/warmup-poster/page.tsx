import React from 'react';
import ElfPlusPoster from '@/components/fifa-11-plus/elf-plus-poster';
import { WARMUP_DRILLS } from '../_lib/warmup-data';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WarmupPosterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/fifa-11-plus">
            <Button variant="ghost" className="h-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zu FIFA 11+
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Component */}
      <ElfPlusPoster drills={WARMUP_DRILLS} />

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>FIFA 11+ Warm-up Training Programm</p>
            <p className="mt-1">
              Klicken Sie auf die Übungen im Poster oder in der Liste, um die Videos abzuspielen.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}