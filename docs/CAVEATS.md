# Caveats

This is an early stage work, there is a lot to be improved though we found it's still a valuable resource that could be enhance with the testing and help of others

- Find method uses query and scan, while query is suitable for real queries, scan goes through every item thus it gets slower and slower as your table gets more items. Find will always try to use query first.
