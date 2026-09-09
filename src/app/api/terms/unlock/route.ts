import { NextResponse } from 'next/server';
import { requestTermUnlock } from '../../../../../functions/src/term-management';

function formatErrorMessage(error: any): { message: string; statusCode: number } {
  const errMsg = String(error?.message || error || '');

  if (errMsg.includes('INVALID_ARGUMENT') || errMsg.includes('Transaction too big') || errMsg.includes('500 writes')) {
    return {
      message: 'The transaction size exceeded database limits. The unlock operation has been streamlined to use metadata windows.',
      statusCode: 400,
    };
  }
  if (errMsg.includes('PERMISSION_DENIED') || errMsg.includes('Missing or insufficient permissions')) {
    return {
      message: 'You do not have sufficient administrative permissions to unlock this term.',
      statusCode: 403,
    };
  }
  if (errMsg.includes('NOT_FOUND')) {
    return {
      message: 'The specified school settings or term record could not be found.',
      statusCode: 404,
    };
  }
  if (errMsg.includes('RESOURCE_EXHAUSTED')) {
    return {
      message: 'Database write quota temporarily exceeded. Please try again in a moment.',
      statusCode: 429,
    };
  }
  if (errMsg.includes('Missing required params') || errMsg.includes('required')) {
    return {
      message: error?.message || 'Missing required parameters: schoolId, termId, and reason are required.',
      statusCode: 400,
    };
  }

  return {
    message: error?.message || 'Failed to unlock term for correction. Please try again later.',
    statusCode: 500,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { schoolId, termId, requestedDurationHours, reason, requestedBy, updateRawRecords } = body;

    if (!schoolId || !termId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: schoolId, termId, and reason are required.' },
        { status: 400 }
      );
    }

    const result = await requestTermUnlock({
      schoolId,
      termId,
      requestedDurationHours,
      reason,
      requestedBy,
      updateRawRecords: Boolean(updateRawRecords),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API /api/terms/unlock Error:', error);
    const { message, statusCode } = formatErrorMessage(error);
    return NextResponse.json(
      { error: message },
      { status: statusCode }
    );
  }
}
