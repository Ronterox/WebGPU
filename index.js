const canvas = document.querySelector("canvas");

function log(msg, error = false) {
  const elemLog = document.getElementById("log");
  elemLog.innerHTML = "LOG: " + msg + "<br>";
  if (error) {
    elemLog.style.color = "red";
    throw new Error(msg);
  }
}

// Your WebGPU code will begin here!
if (!navigator.gpu) log("WebGPU is not supported!", true);
log("WebGPU is supported!");

const adapter = await navigator.gpu.requestAdapter();
if (!adapter) log("No suitable adapter found!", true);
log("Adapter found!");

const device = await adapter.requestDevice();
const context = canvas.getContext("webgpu");
const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device: device, format: canvasFormat });
log("Context frame created!");

const encoder = device.createCommandEncoder();
const pass = encoder.beginRenderPass({
  colorAttachments: [
    {
      view: context.getCurrentTexture().createView(),
      loadOp: "clear",
      clearValue: { r: 0, g: 0, b: 0.4, a: 1 },
      storeOp: "store",
    },
  ],
});
pass.end();

device.queue.submit([encoder.finish()]);

log("Queue submitted!");
