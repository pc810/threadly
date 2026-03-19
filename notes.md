# Threadly

## Start order
- Docker (migrations)
- Worker (buckets)
- Springboot (spicedb & schema migrations)

## Problems
- Worker
    - handling async media download from html
    - handling redirect link response when downloading image
- Image Storage
    - Secure media support
- Post
    - storing/rendering html content
    - post-link seo scraping
    - post-link image download
    - Infinite Pagination
    - Feed generation
- Permissions
    - Initial implementation using PermissionResolver not scalable
      - involed @Permission annotation which works uses Aspect to resolve PermissionContext & perform all checks          
    - Moved to spicedb
    - supporting different actions for mod/owner
    - checking which feature to show to user with varied auth
```
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
