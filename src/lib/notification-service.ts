import { Firestore, FieldValue } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

export class NotificationService {
  // Helper to append a structured mock log line
  private static logMockNotification(channel: 'SMS' | 'App Push', recipientName: string, recipientContact: string, message: string, meta: any) {
    try {
      const logDir = path.join(process.cwd(), 'scratch');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      const logPath = path.join(logDir, 'mock-notifications.log');
      const timestamp = new Date().toISOString();
      const entry = {
        timestamp,
        channel,
        recipient: {
          name: recipientName,
          contact: recipientContact
        },
        message,
        metadata: meta
      };
      fs.appendFileSync(logPath, JSON.stringify(entry) + '\n', 'utf8');
      console.log(`[Notification Service] Mock ${channel} -> ${recipientName} (${recipientContact}): ${message}`);
    } catch (e) {
      console.error('Failed to write mock notification log:', e);
    }
  }

  // Helper to create an in-app notification doc in Firestore
  private static async createInAppNotification(db: any, userId: string, schoolId: string, title: string, message: string, type: string) {
    try {
      const notificationRef = db.collection('notifications').doc();
      await notificationRef.set({
        id: notificationRef.id,
        userId,
        schoolId,
        title,
        message,
        createdAt: new Date(),
        read: false,
        type,
      });
    } catch (e) {
      console.error(`Failed to create in-app notification for user ${userId}:`, e);
    }
  }

  // Helper to resolve parent contacts for a student
  private static async getParentContacts(db: any, studentId: string) {
    try {
      const querySnap = await db.collection('parents')
        .where('studentIds', 'array-contains', studentId)
        .get();
      
      return querySnap.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Parent',
          phoneNumber: data.phoneNumber || data.phone || 'N/A',
          email: data.email || 'N/A',
          photoURL: data.photoURL || null,
        };
      });
    } catch (e) {
      console.error(`Error resolving parents for student ${studentId}:`, e);
      return [];
    }
  }

  // Helper to resolve staff by role
  private static async getStaffByRoles(db: any, schoolId: string, roles: string[]) {
    try {
      const staffSnap = await db.collection('staff')
        .where('schoolId', '==', schoolId)
        .where('role', 'in', roles)
        .get();
      
      return staffSnap.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Staff',
          phoneNumber: data.phoneNumber || data.phone || 'N/A',
          role: data.role,
          photoURL: data.photoURL || null,
        };
      });
    } catch (e) {
      console.error(`Error resolving staff for school ${schoolId}:`, e);
      return [];
    }
  }

  // Helper to send a direct message in Firestore
  private static async sendDirectMessage(
    db: any,
    schoolId: string,
    senderId: string,
    senderName: string,
    senderRole: string,
    recipientId: string,
    recipientName: string,
    recipientRole: string,
    recipientPhotoURL: string | null,
    messageText: string
  ) {
    try {
      // 1. Find if there's an existing 1-on-1 chat
      const chatsSnap = await db.collection('direct_messages')
        .where('schoolId', '==', schoolId)
        .where('participants', 'array-contains', recipientId)
        .get();

      let chatId = '';
      const existingChat = chatsSnap.docs.find((d: any) => {
        const chatData = d.data();
        return !chatData.isGroup && chatData.participants.includes(senderId);
      });

      if (existingChat) {
        chatId = existingChat.id;
      } else {
        // Create new direct chat
        const newChatRef = await db.collection('direct_messages').add({
          participants: [senderId, recipientId],
          participantDetails: {
            [senderId]: { name: senderName, role: senderRole, photoURL: null },
            [recipientId]: { name: recipientName, role: recipientRole, photoURL: recipientPhotoURL || null }
          },
          lastMessage: messageText.substring(0, 60),
          lastMessageTime: FieldValue.serverTimestamp(),
          unreadCount: { [recipientId]: 1, [senderId]: 0 },
          schoolId,
          isGroup: false
        });
        chatId = newChatRef.id;
      }

      // 2. Add message to messages subcollection
      await db.collection(`direct_messages/${chatId}/messages`).add({
        text: messageText,
        senderId,
        createdAt: FieldValue.serverTimestamp(),
        type: 'text',
        status: 'sent'
      });

      // 3. Update direct_messages metadata
      const chatRef = db.collection('direct_messages').doc(chatId);
      const chatUpdate: any = {
        lastMessage: messageText.substring(0, 60),
        lastMessageTime: FieldValue.serverTimestamp()
      };
      chatUpdate[`unreadCount.${recipientId}`] = FieldValue.increment(1);
      await chatRef.update(chatUpdate);

      console.log(`[Notification Service] Direct Message sent from ${senderName} to ${recipientName}: "${messageText.substring(0, 40)}..."`);
    } catch (e) {
      console.error(`Failed to send direct message from ${senderId} to ${recipientId}:`, e);
    }
  }

  /**
   * Trigger parent notification when a gate-action logs a student checkout or return
   */
  public static async triggerGatePassEvent(
    db: any,
    studentId: string,
    studentName: string,
    action: 'checkout' | 'checkin',
    details: {
      leaveType: string;
      destination: string;
      reason: string;
      schoolId: string;
    }
  ) {
    const parents = await this.getParentContacts(db, studentId);
    const timestampStr = new Date().toLocaleTimeString();

    for (const parent of parents) {
      const title = `🚪 Gate Action Alert: ${studentName}`;
      let message = '';
      if (action === 'checkout') {
        message = `GAM EDU Alert: ${studentName} checked OUT at the campus gate at ${timestampStr}. Destination: "${details.destination}", Type: ${details.leaveType}, Reason: "${details.reason}".`;
      } else {
        message = `GAM EDU Alert: ${studentName} successfully checked IN at the campus gate at ${timestampStr}. Return completed.`;
      }

      // 1. Send SMS and App Push mock notifications
      this.logMockNotification('SMS', parent.name, parent.phoneNumber, message, { studentId, action });
      this.logMockNotification('App Push', parent.name, parent.email, message, { studentId, action });

      // 2. Write in-app notification doc
      await this.createInAppNotification(db, parent.id, details.schoolId, title, message, 'leave_alert');

      // 3. Send Direct Message as an additional channel
      await this.sendDirectMessage(
        db,
        details.schoolId,
        'SYSTEM',
        'GAM EDU Boarding System',
        'System',
        parent.id,
        parent.name,
        'Parent',
        parent.photoURL,
        message
      );
    }
  }

  /**
   * Trigger parent and warden notifications when an infirmary visit is logged.
   * If flagged as severe triage, dispatches immediate high-priority alerts to admins.
   */
  public static async triggerMedicalVisitEvent(
    db: any,
    studentId: string,
    studentName: string,
    logData: {
      schoolId: string;
      reportedSymptoms: string;
      treatmentAdministered: string;
      disposition: string;
      isSevereTriage: boolean;
      treatingStaffName: string;
    }
  ) {
    const parents = await this.getParentContacts(db, studentId);
    const wardens = await this.getStaffByRoles(db, logData.schoolId, ['Warden', 'Boarding Staff']);

    // 1. Notify Parents
    for (const parent of parents) {
      const title = logData.isSevereTriage ? '🚨 EMERGENCY: Severe Medical Triage Notice' : '🩺 Medical Visit Notice: ' + studentName;
      const message = `${studentName} was seen at the campus Sick Bay by treating staff: ${logData.treatingStaffName}. Reported Symptoms: "${logData.reportedSymptoms}". Treatment Administered: "${logData.treatmentAdministered}". Disposition: ${logData.disposition}.` + 
        (logData.isSevereTriage ? ' Immediate medical escalation is in progress.' : '');

      this.logMockNotification('SMS', parent.name, parent.phoneNumber, message, { studentId, severe: logData.isSevereTriage });
      this.logMockNotification('App Push', parent.name, parent.email, message, { studentId, severe: logData.isSevereTriage });
      await this.createInAppNotification(db, parent.id, logData.schoolId, title, message, logData.isSevereTriage ? 'medical_emergency' : 'medical_alert');

      // Direct Message to Parent
      await this.sendDirectMessage(
        db,
        logData.schoolId,
        'SYSTEM',
        'GAM EDU Sick Bay',
        'Medical',
        parent.id,
        parent.name,
        'Parent',
        parent.photoURL,
        message
      );
    }

    // 2. Notify Wardens
    for (const warden of wardens) {
      const title = logData.isSevereTriage ? '🚨 EMERGENCY: Severe Sick Bay Visit' : '🩺 Sick Bay Visit: ' + studentName;
      const message = `Student ${studentName} visited Sick Bay. Symptoms: "${logData.reportedSymptoms}". Treatment: "${logData.treatmentAdministered}". Disposition: ${logData.disposition}. Registered by: ${logData.treatingStaffName}.`;

      this.logMockNotification('SMS', warden.name, warden.phoneNumber, message, { studentId, severe: logData.isSevereTriage });
      await this.createInAppNotification(db, warden.id, logData.schoolId, title, message, logData.isSevereTriage ? 'medical_emergency' : 'medical_alert');

      // Direct Message to Warden
      await this.sendDirectMessage(
        db,
        logData.schoolId,
        'SYSTEM',
        'GAM EDU Sick Bay',
        'Medical',
        warden.id,
        warden.name,
        warden.role,
        warden.photoURL,
        message
      );
    }

    // 3. IF SEVERE TRIAGE: Notify School Administrators
    if (logData.isSevereTriage) {
      const admins = await this.getStaffByRoles(db, logData.schoolId, ['Director', 'Administrator', 'Admin']);
      for (const admin of admins) {
        const title = '🚨 URGENT: Severe Medical Triage Event';
        const message = `IMMEDIATE ESCALATION: Student ${studentName} is in the Sick Bay with severe symptoms: "${logData.reportedSymptoms}". Disposition: ${logData.disposition}. Registered by: ${logData.treatingStaffName}.`;

        this.logMockNotification('SMS', admin.name, admin.phoneNumber, message, { studentId, severe: true });
        this.logMockNotification('App Push', admin.name, admin.phoneNumber, message, { studentId, severe: true });
        await this.createInAppNotification(db, admin.id, logData.schoolId, title, message, 'medical_emergency');

        // Direct Message to Admin
        await this.sendDirectMessage(
          db,
          logData.schoolId,
          'SYSTEM',
          'GAM EDU Sick Bay',
          'Medical',
          admin.id,
          admin.name,
          admin.role,
          admin.photoURL,
          message
        );
      }
    }
  }

  /**
   * Trigger immediate high-priority alert to wardens and administrators when a student is unaccounted during roll call
   */
  public static async triggerUnaccountedRollCallEvent(
    db: any,
    studentId: string,
    date: string,
    recordedByName: string
  ) {
    try {
      const studentDoc = await db.collection('students').doc(studentId).get();
      if (!studentDoc.exists) return;
      const studentData = studentDoc.data()!;
      const studentName = `${studentData.firstName || ''} ${studentData.lastName || ''}`.trim() || 'Unknown Student';
      const schoolId = studentData.schoolId;

      if (!schoolId) return;

      // Notify Wardens, Boarding Staff, and Admins
      const staffToAlert = await this.getStaffByRoles(db, schoolId, ['Warden', 'Boarding Staff', 'Director', 'Administrator', 'Admin']);

      for (const staff of staffToAlert) {
        const title = `🚨 EMERGENCY: Unaccounted Student ${studentName}`;
        const message = `CRITICAL ALERT: Student ${studentName} is absent and UNACCOUNTED for during night roll-call on ${date}. Logged by Warden: ${recordedByName}. Immediate verification/search required.`;

        this.logMockNotification('SMS', staff.name, staff.phoneNumber, message, { studentId, status: 'Unaccounted' });
        this.logMockNotification('App Push', staff.name, staff.phoneNumber, message, { studentId, status: 'Unaccounted' });
        await this.createInAppNotification(db, staff.id, schoolId, title, message, 'rollcall_alert');

        // Direct Message to Staff/Admin
        await this.sendDirectMessage(
          db,
          schoolId,
          'SYSTEM',
          'GAM EDU Boarding System',
          'System',
          staff.id,
          staff.name,
          staff.role,
          staff.photoURL,
          message
        );
      }
    } catch (err) {
      console.error(`Error sending unaccounted roll call notification for student ${studentId}:`, err);
    }
  }

  /**
   * Trigger parent balance updates when wallet top-ups or debits occur
   */
  public static async triggerWalletTransactionEvent(
    db: any,
    studentId: string,
    studentName: string,
    schoolId: string,
    txnData: {
      amount: number;
      type: 'Credit' | 'Debit';
      description: string;
      reference: string;
      balance: number;
      recordedByName: string;
    }
  ) {
    const parents = await this.getParentContacts(db, studentId);

    for (const parent of parents) {
      const title = `💰 Pocket Money Wallet Update: ${studentName}`;
      const actionText = txnData.type === 'Credit' ? 'credited with GHS ' + txnData.amount.toFixed(2) : 'debited with GHS ' + Math.abs(txnData.amount).toFixed(2);
      const message = `GAM EDU Wallet Notification: ${studentName}'s digital pocket money wallet was successfully ${actionText} for "${txnData.description}". New Wallet Balance: GHS ${txnData.balance.toFixed(2)}. Reference: ${txnData.reference}.`;

      this.logMockNotification('SMS', parent.name, parent.phoneNumber, message, { studentId, transactionRef: txnData.reference });
      await this.createInAppNotification(db, parent.id, schoolId, title, message, 'wallet_update');

      // Direct Message to Parent
      await this.sendDirectMessage(
        db,
        schoolId,
        'SYSTEM',
        'GAM EDU Digital Wallet',
        'Finance',
        parent.id,
        parent.name,
        'Parent',
        parent.photoURL,
        message
      );
    }
  }

  /**
   * Trigger notifications to wardens and administrators when a student is suspended/withdrawn and room clearance is done
   */
  public static async triggerRoomClearanceEvent(
    db: any,
    studentId: string,
    studentName: string,
    schoolId: string,
    newStatus: 'Suspended' | 'Withdrawn',
    allocationDetails: {
      blockName: string;
      roomNumber: string;
      bedIdentifier: string;
    }
  ) {
    try {
      const message = `CRITICAL ALERT: Student ${studentName} (ID: ${studentId}) status has changed to "${newStatus}" on the academic side. A room clearance workflow has been automatically triggered: their allocated bed in ${allocationDetails.blockName}, Room ${allocationDetails.roomNumber} (Bed ${allocationDetails.bedIdentifier}) has been released and is now Available.`;
      const title = `⚠️ Room Clearance: ${studentName} (${newStatus})`;

      // Notify Wardens, Boarding Staff, and Admins
      const staffToAlert = await this.getStaffByRoles(db, schoolId, ['Warden', 'Boarding Staff', 'Director', 'Administrator', 'Admin']);

      for (const staff of staffToAlert) {
        this.logMockNotification('SMS', staff.name, staff.phoneNumber, message, { studentId, status: newStatus });
        this.logMockNotification('App Push', staff.name, staff.phoneNumber, message, { studentId, status: newStatus });
        await this.createInAppNotification(db, staff.id, schoolId, title, message, 'room_clearance');

        // Direct Message to Staff/Admin
        await this.sendDirectMessage(
          db,
          schoolId,
          'SYSTEM',
          'GAM EDU Boarding System',
          'System',
          staff.id,
          staff.name,
          staff.role,
          staff.photoURL,
          message
        );
      }
    } catch (err) {
      console.error(`Error sending room clearance notification for student ${studentId}:`, err);
    }
  }
}
