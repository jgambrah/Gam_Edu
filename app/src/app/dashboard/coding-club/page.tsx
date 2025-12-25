import ScratchEngine from '@/components/ScratchEngine';

export default function CodingClubPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Coding Club</h1>
            <p className="text-muted-foreground mb-6">
                Welcome to the Coding Club! Use the blocks below to create your own animations and games.
                Click the green flag to run your code.
            </p>
            <div className="h-[600px] w-full border rounded-lg overflow-hidden">
                <ScratchEngine />
            </div>
        </div>
    );
}
