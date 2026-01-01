# Threadly

## Problems
- Image Storage
    - Secure media support
- Post
    - storing/rendering html content
    - post-link seo scraping
    - post-link image download
- Permissions
    - Initial implementation using PermissionResolver not scalable
      - involed @Permission annotation which works uses Aspect to resolve PermissionContext & perform all checks          
    - Moved to spicedb

```
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
