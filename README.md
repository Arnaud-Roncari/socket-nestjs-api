# My thoughts on using sockets with NestJS for my first time.

## Architecture:

Since this was the first time I'd done sockets, I first implemented most of the code, in HTTP style.
Then I added socket management.

I ran into a problem. My services were returning HTTP errors (e.g. UserNotFound). These errors are not compatible with Sockets.
So I implemented a "filter" that converted HTTP errors into Socket errors. Knowing that the DTO Validation Pipe always returns HTTP errors (lol).

I've also oriented some of my services' functions for Sockets. But then I had functions in my services that only worked for HTTP or Socket. If the code gets more complex, it'll become unreadable.

Maybe I should have created a module just for sockets ?

## Response system:

In addition, a response logic has been added. I've integrated the fact that in some cases, when the frontend sends information to the backend, the backend sends back a response (socket).
We can call these "transactions". These transactions have UUIDs. Allowing the frontend to identify the response, whether successful or not.

Maybe it's because of my architecture, this being my first time. But I'm not a fan of this method. Both in the front and in the backend, I find it making reading more complex.

If I had to redo the project, I'd spend most of the logic in HTTP, leaving only the notification logic in Socket (new-message, etc.).

But what about performance ?

Feel free to criticize my socket implementation.