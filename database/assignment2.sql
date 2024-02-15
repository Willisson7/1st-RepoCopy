-- practice statements

INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark','tony@starkent.com', 'Iam1ronM@n')

Update account 
Set account_type = 'Admin'
WHERE account_id = 1


DELETE FROM account
WHERE account_id = 1

-- UPDATE GM HUMMER description

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';
-- Would probably be better to target via inv_id, given the likelihood of multiple styles of hummers in larger databases.

-- Query multiple tables
SELECT (i.inv_make, i.inv_model, c.classification_name)
FROM inventory i INNER JOIN classification c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';


--update multiple columns
UPDATE inventory
SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/');
