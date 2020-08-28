require("./logger");
const tracer = require("dd-trace").init({
  analytics:true, logInjection:true, profiling:true
});