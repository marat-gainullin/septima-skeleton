drop all objects;

Create User If Not Exists SA SALT 'f6e293b0d7d6a619' HASH '50007d9c9583418d29b0d79144556ca7ce646060aacc1af32ffbe2dbf9a4d55e' ADMIN;

Create Table Public.AppUsers (
    userEmail Varchar(100) Not Null,
    userDisplayName Varchar(100),
    userDigest Varchar(100),
    userAvatar Varchar(255)
);
Alter Table Public.AppUsers Add Constraint Public.appUsersPk Primary Key(userEmail);

Create Table Public.AppUsersGroups (
    userEmail Varchar(100) Not Null,
    userGroup Varchar(100) Not Null
);
Alter Table Public.AppUsersGroups Add Constraint Public.appUsersGroupsPk Primary Key(userEmail, userGroup);

Create Table Public.AppUsersVerification (
    userEmail Varchar(100) Not Null,
    userNonce Varchar(100) Not Null,
    nonceExpiration Timestamp Not Null
);
Alter Table Public.AppUsersVerification Add Constraint Public.AppUsersVerificationPk Primary Key(userEmail, userNonce);

Create Table Public.AppUsersPasswordRecovering (
    userEmail Varchar(100) Not Null,
    userNonce Varchar(100) Not Null,
    nonceExpiration Timestamp Not Null
);
Alter Table Public.AppUsersPasswordRecovering Add Constraint Public.AppUsersPasswordRecoveringPk Primary Key(userEmail, userNonce);

Create cached Table Public.Owners(
    owners_id Decimal(18, 0) Not Null,
    firstName Varchar(100),
    lastName Varchar(100),
    address Varchar(100),
    city Varchar(100),
    telephone Varchar(100),
    email Varchar(100)
);
Alter Table Public.Owners Add Constraint Public.ownersPk Primary Key(owners_id);
-- 2 +/- SELECT COUNT(*) FROM Public.OWNERS;
insert into Public.Owners(owners_id, firstName, lastName, address, city, telephone, email) Values
(142841788496711, 'Ivan', 'Ivanov', 'Ivanovskaya st.', 'Ivanovo', '+79011111111', 'sample@example.com'),
(142841834950629, 'Petr', 'Petrov', 'Petrovskaya', 'Saint Petersburg', '+79022222222', 'test@test.ru');
Create cached Table Public.pets(
    pets_id Decimal(18, 0) Not Null,
    owner_id Decimal(65535, 32767) Not Null,
    type_id Decimal(65535, 32767) Not Null,
    name Varchar(100),
    birthDate Timestamp
);
Alter Table Public.Pets Add Constraint Public.pets_pk Primary Key(pets_id);
-- 3 +/- select count(*) from Public.pets;
insert into Public.Pets(pets_id, owner_id, type_id, name, birthDate) Values
(142841880961396, 142841788496711, 142841300122653, 'Druzhok', Null),
(142841883974964, 142841834950629, 142841300155478, 'Vasya', Timestamp '2015-04-29 00:00:00.0'),
(143059430815594, 142841788496711, 142850046716850, 'Pik', Null);
Create cached Table Public.petTypes(
    petTypes_id Decimal(18, 0) Not Null,
    name Varchar(100)
);
Alter Table Public.PetTypes Add Constraint Public.petTypes_pk Primary Key(petTypes_id);
insert into Public.PetTypes(petTypes_id, name) Values
(142841300122653, 'Dog'),
(142841300155478, 'Cat'),
(142850046716850, 'Mouse');
Create cached Table Public.temp(
    temp_id Decimal(18, 0) Not Null,
    field1 blob(100) Not Null
);
Alter Table Public.Temp Add Constraint Public.tempPk Primary Key(temp_id);
Create cached Table Public.Visit(
    visit_id Decimal(18, 0) Not Null,
    pet_id Decimal(65535, 32767) Not Null,
    fromDate Timestamp,
    toDate Timestamp,
    description Varchar(100),
    isPaid boolean
);
Alter Table Public.Visit Add Constraint Public.visit_pk Primary Key(visit_id);
insert into Public.Visit(visit_id, pet_id, fromDate, toDate, description, isPaid) Values
(143023673259940, 142841883974964, Timestamp '2015-04-28 18:58:52.604', Timestamp '2015-04-29 00:00:00.0', stringDecode('\u044b\u0430\u0432\u043a\u043f'), Null),
(143031982989403, 142841880961396, Timestamp '2015-04-29 18:03:49.898', Null, Null, Null),
(143029901200462, 142841883974964, Timestamp '2015-04-29 12:16:52.008', Timestamp '2015-04-30 00:00:00.0', '1234', Null);
Alter Table Public.pets Add Constraint Public.fk_143039780889568 Foreign Key(type_id) References Public.petTypes(petTypes_id) On Delete Cascade On Update Cascade NoCheck;
Alter Table Public.pets Add Constraint Public.fk_137568650945995 Foreign Key(owner_id) References Public.owners(owners_id) On Delete Cascade On Update Cascade NoCheck;
Alter Table Public.visit Add Constraint Public.fk_137568671360207 Foreign Key(pet_id) References Public.pets(pets_id) On Delete Cascade On Update Cascade NoCheck;