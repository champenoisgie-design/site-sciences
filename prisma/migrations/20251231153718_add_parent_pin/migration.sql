-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "plan" TEXT,
    "status" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubId" TEXT,
    "stripePriceId" TEXT,
    "currentPeriodEnd" DATETIME,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Trial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Trial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChapterAccess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "chapterKey" TEXT NOT NULL,
    "purchasedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priceCents" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChapterAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ParentProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "wantsReports" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ParentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserDevice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "uaHash" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "lastSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserDevice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrialLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "emailHash" TEXT,
    "deviceHash" TEXT,
    "ip" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "occurredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserStreak" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "current" INTEGER NOT NULL DEFAULT 0,
    "best" INTEGER NOT NULL DEFAULT 0,
    "lastDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DeviceSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "deviceHash" TEXT NOT NULL,
    "sessionKey" TEXT NOT NULL,
    "userAgent" TEXT,
    "ip" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" DATETIME
);

-- CreateTable
CREATE TABLE "LoginOtp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "deviceHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "consumedAt" DATETIME,
    "ip" TEXT
);

-- CreateTable
CREATE TABLE "FamilyMembership" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ParentLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentUserId" TEXT NOT NULL,
    "studentUserId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "learningMode" TEXT NOT NULL DEFAULT 'normal',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TeacherMembership" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TeacherStudentLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacherUserId" TEXT NOT NULL,
    "studentUserId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ParentPinSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "unlockedUntil" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ParentPinSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "passwordHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "stripeCustomerId" TEXT,
    "parentPinHash" TEXT,
    "parentPinSetAt" DATETIME,
    "parentPinFailed" INTEGER NOT NULL DEFAULT 0,
    "parentPinLockedUntil" DATETIME
);
INSERT INTO "new_User" ("createdAt", "email", "emailVerified", "id", "image", "name", "passwordHash", "stripeCustomerId", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "image", "name", "passwordHash", "stripeCustomerId", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscription_stripeSubId_key" ON "UserSubscription"("stripeSubId");

-- CreateIndex
CREATE INDEX "UserSubscription_userId_type_key_idx" ON "UserSubscription"("userId", "type", "key");

-- CreateIndex
CREATE INDEX "UserSubscription_userId_status_idx" ON "UserSubscription"("userId", "status");

-- CreateIndex
CREATE INDEX "Trial_userId_idx" ON "Trial"("userId");

-- CreateIndex
CREATE INDEX "chapter_unique_idx" ON "ChapterAccess"("userId", "subject", "level", "chapterKey");

-- CreateIndex
CREATE INDEX "ParentProfile_userId_idx" ON "ParentProfile"("userId");

-- CreateIndex
CREATE INDEX "UserDevice_userId_uaHash_ipHash_idx" ON "UserDevice"("userId", "uaHash", "ipHash");

-- CreateIndex
CREATE INDEX "TrialLog_emailHash_idx" ON "TrialLog"("emailHash");

-- CreateIndex
CREATE INDEX "TrialLog_deviceHash_idx" ON "TrialLog"("deviceHash");

-- CreateIndex
CREATE INDEX "UserActivity_userId_occurredAt_idx" ON "UserActivity"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "DeviceSession_userId_lastSeenAt_idx" ON "DeviceSession"("userId", "lastSeenAt");

-- CreateIndex
CREATE INDEX "DeviceSession_userId_deviceHash_idx" ON "DeviceSession"("userId", "deviceHash");

-- CreateIndex
CREATE INDEX "LoginOtp_userId_deviceHash_createdAt_idx" ON "LoginOtp"("userId", "deviceHash", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ParentLink_parentUserId_studentUserId_key" ON "ParentLink"("parentUserId", "studentUserId");

-- CreateIndex
CREATE INDEX "TeacherStudentLink_teacherUserId_idx" ON "TeacherStudentLink"("teacherUserId");

-- CreateIndex
CREATE INDEX "TeacherStudentLink_studentUserId_idx" ON "TeacherStudentLink"("studentUserId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherStudentLink_teacherUserId_studentUserId_key" ON "TeacherStudentLink"("teacherUserId", "studentUserId");

-- CreateIndex
CREATE INDEX "ParentPinSession_userId_sessionId_idx" ON "ParentPinSession"("userId", "sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentPinSession_userId_sessionId_key" ON "ParentPinSession"("userId", "sessionId");
