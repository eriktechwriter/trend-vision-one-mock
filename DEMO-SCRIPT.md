# Agentic Documentation Demo Script

## Overview

This demo script guides you through the key features of the Agentic Documentation POC. Follow these steps to experience how context-aware, role-based documentation adapts to different users and scenarios.

**Duration**: 10-15 minutes  
**Audience**: Stakeholders, product managers, technical writers, developers

## Prerequisites

- Access to the live demo: https://eriktechwriter.github.io/agentic-docs-poc/mock-site/
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Basic familiarity with security product interfaces

## Demo Flow

### Part 1: Introduction (2 minutes)

**Talking Points**:
- Traditional documentation is static and one-size-fits-all
- Users must leave their workflow to search for help
- Different roles need different information
- Agentic documentation solves these problems by:
  - Detecting user context (role, page, task)
  - Generating personalized content
  - Delivering help without disrupting workflow

**Action**: Open the landing page
```
https://eriktechwriter.github.io/agentic-docs-poc/mock-site/
```

**What to Show**:
- Clean, professional interface matching Trend Micro branding
- Three main product areas: Attack Surface Discovery, Workbench, Endpoint Inventory
- User type selector in top-right corner
- Help button (❓) always accessible

---

### Part 2: Role-Based Content (3 minutes)

**Scenario**: "Let's see how the same page looks different for different user roles."

#### Step 1: Admin User Perspective

1. **Select "Admin User"** from the user type dropdown (top-right)
2. **Navigate to "Attack Surface Discovery"** (side nav)
3. **Click the Help button** (❓ in top-right)

**What to Point Out**:
- Help panel slides in from the right
- Content is technical and detailed
- Focus on configuration and management tasks
- "How to:" section includes admin-specific actions:
  - Configure data sources
  - Manage device policies
  - Set up automated scans

**Key Quote**: 
> "Notice how the help content is written for someone who needs to configure and manage the system."

#### Step 2: CISO Perspective

1. **Close the help panel** (X button or ESC key)
2. **Switch to "CISO"** in the user type dropdown
3. **Click the Help button** again

**What to Point Out**:
- Same page, but content is completely different
- Focus shifts to executive-level concerns:
  - Risk overview and trends
  - Compliance status
  - Business impact
- Less technical detail, more strategic guidance
- Different "How to:" items:
  - Review risk trends
  - Generate executive reports
  - Monitor compliance posture

**Key Quote**:
> "The system understands that a CISO doesn't need to know how to configure sensors—they need to understand risk and compliance."

#### Step 3: Security Analyst Perspective

1. **Close the help panel**
2. **Switch to "Security Analyst"**
3. **Click the Help button**

**What to Point Out**:
- Content focuses on investigation and analysis
- Emphasis on threat detection and response
- "How to:" section includes analyst tasks:
  - Investigate suspicious devices
  - Analyze risk scores
  - Correlate with threat intelligence

**Key Quote**:
> "Analysts get content focused on their day-to-day work: investigating threats and analyzing security data."

---

### Part 3: Context-Aware Help (3 minutes)

**Scenario**: "The system doesn't just adapt to user role—it also adapts to what you're doing."

#### Step 1: Different Pages, Different Content

1. **Stay as "Security Analyst"**
2. **Navigate to "Workbench"** (side nav)
3. **Click the Help button**

**What to Point Out**:
- Content is now about threat investigation
- Explains alert triage and incident response
- Specific to the Workbench page
- Context key shown: `analyst:workbench`

4. **Navigate to "Endpoint Inventory"**
5. **Click the Help button**

**What to Point Out**:
- Content changes again to focus on endpoint management
- Explains device inventory and compliance
- Context key: `analyst:endpoint-inventory`

**Key Quote**:
> "The help system knows exactly where you are and what you're trying to do."

#### Step 2: Section-Specific Help (Future)

**Talking Point**:
> "In a full implementation, the system would also detect which tab or section you're viewing. For example, if you're on the 'Devices' tab versus the 'Accounts' tab, you'd get different help content."

---

### Part 4: Interactive Tooltips (2 minutes)

**Scenario**: "Sometimes you don't need a full help panel—just a quick tip."

1. **Stay on any page** (e.g., Attack Surface Discovery)
2. **Hover over or click the help icon (❓)** next to the "Devices" tab

**What to Point Out**:
- Tooltip appears instantly
- Positioned to avoid going off-screen
- Brief, focused explanation
- Adapts to user role (try switching roles and hovering again)

3. **Try other help icons** on the page:
   - Tab labels
   - Chart titles
   - Filter options

**Key Quote**:
> "Tooltips provide just-in-time help without interrupting your workflow."

---

### Part 5: Seamless Integration (2 minutes)

**Scenario**: "The help system integrates seamlessly with the product interface."

#### Features to Demonstrate:

1. **Keyboard Navigation**:
   - Press `ESC` to close help panel
   - Press `Tab` to navigate between elements
   - Press `Enter` to activate buttons

2. **Smooth Animations**:
   - Help panel slides in/out smoothly
   - Tooltips fade in/out
   - Page transitions are smooth

3. **Persistent Context**:
   - Switch user type
   - Navigate to different page
   - Open help panel
   - Notice user type is remembered (stored in browser)

4. **Action Buttons**:
   - Show "Chat with Companion" button (future feature)
   - Show "Open Full Documentation" button (links to docs site)

**Key Quote**:
> "The help system feels like a natural part of the product, not a separate documentation site."

---

### Part 6: Technical Architecture (2 minutes)

**Scenario**: "Let's look under the hood at how this works."

**Open Browser Console** (F12 or Cmd+Option+I):

```javascript
// Show current context
window.contextEngine.getContext()

// Show context key
window.contextEngine.getContextKey()

// Show cache stats
window.contentGenerator.getCacheStats()
```

**What to Point Out**:
- Context engine tracks user state
- Content generator loads and caches content
- Context key format: `{userType}:{page}:{section}`
- Content is cached for performance

**Architecture Diagram** (verbal):
```
User Interaction
    ↓
Context Engine (detects role, page, section)
    ↓
Content Generator (loads appropriate content)
    ↓
Help Panel / Tooltip (displays personalized content)
```

**Key Quote**:
> "The system is built with vanilla JavaScript for simplicity, but the architecture is extensible for future AI integration."

---

### Part 7: Future Vision (2 minutes)

**Scenario**: "This is just the beginning. Here's where we're headed."

#### Phase 2: API Integration
**Talking Point**:
> "Instead of static JSON files, content will be fetched from a backend API that can aggregate information from multiple sources and apply business logic."

#### Phase 3: LLM Integration
**Talking Point**:
> "We'll integrate with large language models (like GPT-4) to generate content in real-time based on:
> - Current context
> - User's recent actions
> - Related documentation
> - Common questions from similar users"

**Example Scenario**:
> "Imagine you're investigating an alert. The system sees you've been on this alert for 5 minutes, checks what other analysts did with similar alerts, and proactively suggests: 'Users investigating similar alerts often check the endpoint's recent file activity. Would you like to see that?'"

#### Phase 4: Learning & Improvement
**Talking Point**:
> "The system will learn from user interactions:
> - Which help content is most useful
> - When users need help (but don't ask)
> - What questions aren't being answered
> - How to improve content over time"

---

## Demo Variations

### Quick Demo (5 minutes)

For time-constrained audiences:

1. **Show landing page** (30 seconds)
2. **Switch between 2 user types** on same page (2 minutes)
3. **Show tooltips** (1 minute)
4. **Explain future vision** (1.5 minutes)

### Technical Deep Dive (20 minutes)

For technical audiences:

1. **Complete standard demo** (10 minutes)
2. **Show code structure** (3 minutes)
   - Open `context-engine.js` in editor
   - Show `help-content.json` structure
   - Explain content key format
3. **Demonstrate extensibility** (3 minutes)
   - Show how to add new content
   - Explain API integration points
   - Discuss LLM integration approach
4. **Q&A** (4 minutes)

### Executive Demo (8 minutes)

For executives and decision-makers:

1. **Problem statement** (1 minute)
   - Traditional docs are inefficient
   - Users waste time searching
   - One-size-fits-all doesn't work
2. **Solution demo** (4 minutes)
   - Show role-based content (2 roles)
   - Show context awareness (2 pages)
3. **Business value** (2 minutes)
   - Reduced support tickets
   - Faster user onboarding
   - Improved user satisfaction
   - Competitive differentiation
4. **Next steps** (1 minute)

---

## Key Messages

### For All Audiences

1. **Context Matters**: The same page means different things to different users
2. **Personalization Works**: Users get exactly the information they need
3. **Seamless Integration**: Help is always available without disrupting workflow
4. **Future-Ready**: Architecture supports AI/LLM integration

### For Technical Audiences

1. **Simple Architecture**: Vanilla JavaScript, no complex frameworks
2. **Extensible Design**: Easy to add new content and features
3. **Performance Optimized**: Caching, lazy loading, minimal DOM manipulation
4. **Standards Compliant**: Accessible, responsive, cross-browser compatible

### For Business Audiences

1. **Reduces Support Costs**: Users find answers without contacting support
2. **Improves Productivity**: Less time searching, more time working
3. **Enhances User Experience**: Help feels natural and intuitive
4. **Competitive Advantage**: Few products offer this level of personalization

---

## Common Questions & Answers

### Q: How does the system know what content to show?

**A**: The Context Engine tracks three things:
1. **User role** (selected by user or detected from login)
2. **Current page** (detected from URL)
3. **Current section** (detected from active tab or element)

These combine into a "context key" (e.g., `analyst:workbench:alerts`) that maps to specific content.

### Q: Where does the content come from?

**A**: Currently from static JSON files. In the future:
- **Phase 2**: Backend API aggregating multiple sources
- **Phase 3**: AI/LLM generating content in real-time
- **Phase 4**: Hybrid approach with AI + curated content

### Q: How do you ensure content quality with AI?

**A**: Multiple strategies:
1. **Human review**: AI-generated content reviewed by technical writers
2. **Source grounding**: AI uses official documentation as source material
3. **Feedback loops**: Users can rate content quality
4. **Fallback content**: Curated content used when AI confidence is low

### Q: What about users who prefer traditional docs?

**A**: The system complements, not replaces, traditional documentation:
- "Open Full Documentation" button always available
- Links to detailed docs in every help panel
- Traditional docs remain accessible at all times

### Q: How much does this cost to implement?

**A**: Depends on approach:
- **Static content** (current): Minimal cost, just content creation
- **API integration**: Moderate cost, backend development + hosting
- **LLM integration**: Higher cost, API fees + infrastructure
- **ROI**: Reduced support costs typically offset implementation costs

### Q: Can this work for other products?

**A**: Absolutely! The architecture is product-agnostic:
1. Define user roles for your product
2. Map product pages and sections
3. Create content for each context
4. Customize UI to match your branding

---

## Demo Tips

### Before the Demo

- [ ] Test all links and features
- [ ] Clear browser cache and cookies
- [ ] Close unnecessary browser tabs
- [ ] Prepare backup (screenshots/video) in case of technical issues
- [ ] Have browser console ready (F12) for technical demos
- [ ] Bookmark key pages for quick access

### During the Demo

- [ ] Speak slowly and clearly
- [ ] Pause after each major point
- [ ] Ask "Does this make sense?" periodically
- [ ] Encourage questions throughout
- [ ] Use the mouse to highlight what you're showing
- [ ] Zoom in on small text if needed (Cmd/Ctrl + +)

### After the Demo

- [ ] Share demo link with attendees
- [ ] Provide README and documentation links
- [ ] Schedule follow-up for questions
- [ ] Gather feedback on the concept
- [ ] Document any feature requests

---

## Troubleshooting

### Help Panel Won't Open

1. Refresh the page (Cmd/Ctrl + R)
2. Check browser console for errors (F12)
3. Try a different browser
4. Clear cache and reload

### Content Not Loading

1. Check internet connection
2. Verify JSON files are accessible
3. Check browser network tab (F12 → Network)
4. Try hard refresh (Cmd/Ctrl + Shift + R)

### User Type Not Changing

1. Check dropdown is working
2. Verify localStorage is enabled
3. Try incognito/private window
4. Clear browser storage

---

## Follow-Up Materials

After the demo, share:

1. **Demo Link**: https://eriktechwriter.github.io/agentic-docs-poc/mock-site/
2. **Documentation**: https://eriktechwriter.github.io/agentic-docs-poc/
3. **README**: [mock-site/README.md](README.md)
4. **Design Doc**: [../.kiro/specs/mock-website-agentic-docs/design.md](../.kiro/specs/mock-website-agentic-docs/design.md)
5. **Requirements**: [../.kiro/specs/mock-website-agentic-docs/requirements.md](../.kiro/specs/mock-website-agentic-docs/requirements.md)

---

## Feedback Form

After the demo, ask attendees:

1. **Clarity**: Did you understand how agentic documentation works? (1-5)
2. **Value**: Do you see value in this approach? (1-5)
3. **Feasibility**: Do you think this is achievable? (1-5)
4. **Interest**: Would you like to see this in our products? (Yes/No)
5. **Concerns**: What concerns or questions do you have?
6. **Suggestions**: What would make this more valuable?

---

## Success Metrics

A successful demo should result in:

- [ ] Attendees understand the concept
- [ ] Attendees see the value proposition
- [ ] Attendees can articulate how it differs from traditional docs
- [ ] Attendees are excited about the future vision
- [ ] Attendees have actionable next steps

---

**Demo prepared by**: Erik (Technical Writer)  
**Last updated**: November 2024  
**Version**: 1.0

**Questions?** Contact the project team or open an issue on GitHub.
