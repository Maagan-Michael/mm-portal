-- Generate test data using a loop and random values
DO $$
DECLARE
    i INTEGER := 1;
   	user_index varchar(40);
    expense_count INTEGER := 3000;  -- Adjust as needed
    usernames varchar(40)[] := array['d26212aa-8269-4184-9411-207d426b4b4b','789ee884-a71f-4d9f-b00d-d97a9ae99991','04ebe4d9-feef-4871-a6d1-dd34553098c6','259b9e7c-ce55-4a0a-96d9-33824be1e364','d18886dd-e4da-4040-97c5-128ad923c676','25f82c7c-5ad8-48a7-aa8a-360a64db0238','75f33a18-dd4e-4746-8e71-a1b2a22a4590','b329cfbc-e186-4c1b-b73c-14d2f53b0a4e','ee0981a6-51c0-44cf-8faf-258cb9f44150','2f7ef985-e13f-4ef3-b6e7-8cabba64052a'];     
BEGIN
    WHILE i <= expense_count loop
	    user_index := usernames[floor(random() * 10 + 1)];		    		    
        INSERT INTO budget_daily (event_date, user_id, amount)
        VALUES (
            (current_date - (random() * 30)::int4)::date, -- Random date within the last 30 days
            user_index,  -- Random user ID
            (random() * 100)::pg_catalog.numeric 
        );
        i := i + 1;
    END LOOP;
END $$;