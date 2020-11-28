delete
from scheduler_coursemeta
where id not in
    (
        /*
            Select the row with minimum
            id in set of same title and same school
        */
        select  min(id)
        from    scheduler_coursemeta
        group by
        title,
        school
    )