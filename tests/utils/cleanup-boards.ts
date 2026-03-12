import * as dotenv from 'dotenv';
dotenv.config();

// Cleanup script — deletes all Trello boards in your workspace
// Run this whenever test boards pile up and hit the free plan limit (10 boards)
// Usage: pnpm cleanup:trello

const apiKey = process.env.TRELLO_API_KEY!;
const token = process.env.TRELLO_TOKEN!;
const baseUrl = 'https://api.trello.com/1';

async function getAllBoards(): Promise<any[]> {
  const response = await fetch(
    `${baseUrl}/members/me/boards?key=${apiKey}&token=${token}&filter=open`
  );
  return response.json() as Promise<any[]>;
}

async function deleteBoard(boardId: string, boardName: string): Promise<void> {
  const response = await fetch(
    `${baseUrl}/boards/${boardId}?key=${apiKey}&token=${token}`,
    { method: 'DELETE' }
  );
  if (response.ok) {
    console.log(`✓ Deleted: "${boardName}"`);
  } else {
    console.log(`✗ Failed to delete: "${boardName}"`);
  }
}

async function cleanupBoards(): Promise<void> {
  console.log('Fetching all boards...\n');
  const boards = await getAllBoards();

  if (boards.length === 0) {
    console.log('No boards found — workspace is already clean!');
    return;
  }

  console.log(`Found ${boards.length} board(s):\n`);
  boards.forEach((b: any) => console.log(`  - ${b.name} (${b.id})`));

  // Only delete boards that look like test boards — keeps any real boards safe
  // Test board names we've been creating throughout the capstone
  const testBoardPatterns = [
    'Test Board',
    'Hybrid Test Board',
    'Board To Delete',
    'My Project Board',
    'AAAAAAAAAA', // boundary test boards from max character limit scenarios
  ];

  const boardsToDelete = boards.filter((b: any) =>
    testBoardPatterns.some(pattern =>
      b.name.toLowerCase().includes(pattern.toLowerCase())
    )
  );

  const boardsToKeep = boards.filter((b: any) =>
    !testBoardPatterns.some(pattern =>
      b.name.toLowerCase().includes(pattern.toLowerCase())
    )
  );

  console.log(`\n🗑  Deleting ${boardsToDelete.length} test board(s)...`);
  console.log(`✋ Keeping ${boardsToKeep.length} board(s) that don't match test patterns\n`);

  for (const board of boardsToDelete) {
    await deleteBoard(board.id, board.name);
  }

  if (boardsToKeep.length > 0) {
    console.log('\nBoards kept (not test boards):');
    boardsToKeep.forEach((b: any) => console.log(`  ✅ ${b.name}`));
  }

  console.log('\n✓ Cleanup complete!');
}

cleanupBoards();