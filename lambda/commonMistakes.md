# ✅ **Most Common Mistakes Developers Make in AWS Lambda**

### **1️⃣ Keeping all logic inside the handler (no global scope usage)**

Developers put everything inside the handler — DB connections, SDK clients, config — causing slow performance and repeated initialization.

---

### **2️⃣ Not reusing database connections**

Creating a fresh DB connection on every invocation → **cold starts + throttling + increased cost**.
Connections should be created **outside** the handler.

---

### **3️⃣ Packaging huge dependencies**

Including entire packages like `aws-sdk`, `axios`, `lodash`, or `moment` when only 10% is used.
Bundle size goes up → cold start goes up.

---

### **4️⃣ Not using AWS SDK v3 (tree-shakeable modules)**

Still using SDK v2 → large bundle sizes + slower cold starts.
SDK v3 reduces size drastically.

---

### **5️⃣ Putting too much CPU work inside Lambda**

Heavy computation (zip, encryption, image processing, large data parsing) → **timeouts + high cost**.
These should run in **Fargate, Step Functions, or Batch**.

---

### **6️⃣ Using synchronous/blocking code in Node.js**

e.g.,
❌ `fs.readFileSync`
❌ long loops
❌ waiting for API responses serially
These kill Lambda performance.

---

### **7️⃣ Not tuning memory properly**

Most developers keep Lambdas at **128 MB**, causing:

* slow execution
* high cold start
* longer billing
  Sometimes increasing memory from **128 → 512 MB** cuts cost to HALF.

---

### **8️⃣ Missing timeouts and retries**

Bad timeout config = runaway costs
Bad retry config = unexpected duplication and bugs
Always set **custom timeouts**, not defaults.

---

### **9️⃣ Logging too much**

Too many `console.log()` calls →

* slow execution
* huge CloudWatch bills
* cluttered logs
  Use **structured logging** instead.

---

### **🔟 Not validating input events**

SQS, EventBridge, API Gateway… all produce different event shapes.
Missing validation → random runtime errors.

---

### **1️⃣1️⃣ Ignoring concurrency settings**

Defaults can cause:

* Too many DB connections
* Sudden cost explosions
* Downstream throttling
  Always configure **Reserved Concurrency** or **Provisioned Concurrency** properly.

---

### **1️⃣2️⃣ Using layers incorrectly**

Many developers put **everything** in layers, turning them into huge blobs.
Layers should contain shared utilities only.

---

### **1️⃣3️⃣ Not removing unused code or dead imports**

Classic Node.js issue — dead code increases bundle size → increases cold start.

---

### **1️⃣4️⃣ Not monitoring Lambda with CloudWatch Insights**

Without metrics, devs don’t notice:

* memory spills
* slow invocations
* repeated cold starts
  Observability is part of optimization.

---

### **1️⃣5️⃣ Using Lambda for everything**

Not knowing when **NOT** to use Lambda:

* WebSockets at high scale
* Long running tasks
* Heavy CPU tasks
* Data streaming
  Right service → better performance.

