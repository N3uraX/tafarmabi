@@ .. @@
 import ShareButton from '../components/ShareButton';
 import MarkdownRenderer from '../components/MarkdownRenderer';
+import { trackBlogView } from '../utils/analytics';
+import { useScrollTracking } from '../hooks/useScrollTracking';

 interface Blog {
@@ .. @@
   const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
+  const [viewTracked, setViewTracked] = useState(false);

   useEffect(() => {
     if (id) {
       fetchBlog();
       fetchRelatedBlogs();
     }
   }, [id]);

+  // Track view when user scrolls 50% through the post
+  useScrollTracking({
+    onScrollThreshold: () => {
+      if (id && !viewTracked) {
+        trackBlogView(id);
+        setViewTracked(true);
+      }
+    },
+    threshold: 50
+  });
+
+  // Also track view after 30 seconds of being on the page
+  useEffect(() => {
+    if (!id || viewTracked) return;
+
+    const timer = setTimeout(() => {
+      trackBlogView(id);
+      setViewTracked(true);
+    }, 30000); // 30 seconds
+
+    return () => clearTimeout(timer);
+  }, [id, viewTracked]);

   const fetchBlog = async () => {