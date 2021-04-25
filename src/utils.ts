export const makeHtmlResponse = ({ body, head = "" }: { body: string; head?: string }) => `
<!DOCTYPE html>
<html>
  <head>
    ${head}
  </head>
  <body>
    ${body}
  </body>
</html>`;
