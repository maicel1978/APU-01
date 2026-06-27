/**
  *PRISMA+ v5.2 — Vanilla JS ES2022+ Modules*
**  Runtime: NO frameworks (R1)
  *Asset vendor local de FFmpeg.wasm; código de terceros usado solo para procesamiento en Worker.*
**/

/**
 * Generate an unique message ID.
 */
export const getMessageID = (() => {
    let messageID = 0;
    return () => messageID++;
})();
