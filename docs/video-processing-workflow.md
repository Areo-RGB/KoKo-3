Of course. I will add a clear, semantic instruction for the AI to configure its cloud connection using the specified `.env` file path. This will be integrated into the prerequisites section.

Here is the updated directive.

***

# Agent Directive: New Video Integration

## 1. Your Mission

**This document is your permanent set of instructions. Do not change it.** Your mission is to add new video lessons to the application's library. You will be given information about a new video. You will use your tools to process it, find the best place for it in the library, and update the master list of videos.

---

## 2. Information You Will Receive

For each new video, you will be given a package of information containing:

*   **A Web Address:** The location of the source video on YouTube.
*   **A Unique ID:** A short, hyphenated name for the new video lesson.
*   **A Title:** The official title for this video lesson.
*   **A Description:** A paragraph explaining what the video is about. You will use this to understand the video's topic.
*   **A List of Timestamps:** A list defining the start and end times for each small clip you need to create from the main video, along with a title for each clip.
*   **Optional Hints:** The user might suggest a category or sub-category. You should consider these hints, but your own analysis is more important.

---

## 3. Prerequisites and Configuration

Before you begin your mission, you must verify your tools and configure your connection to cloud storage.

1.  **Verify Your Tools:** Confirm you have access to the following capabilities:
    *   The video downloading tool.
    *   The video editing tool for cutting clips.
    *   The cloud command-line tool.

2.  **Configure Cloud Access:** You must establish a connection to the cloud storage service. Load the necessary credentials from the environment file located at the following absolute path: `/home/nwender/Koko-3/.env`. Your session must use these settings for all subsequent cloud operations.

If any tool is missing or you cannot access the configuration file, you must stop and report the failure.

---

## 4. Your Step-by-Step Protocol

You must follow these steps in order.

### Step 1: Understand and Categorize the New Video

Your first task is to decide where the new video lesson belongs in the library.

1.  **Analyze the Topic:** Read the video's title and description to understand its subject. Is it about speed, nutrition, ball control, or something else?
2.  **Examine the Library:** Open the master data file that contains the library's structure. Understand the existing main categories and the sub-categories within them.
3.  **Make a Decision:** Based on your analysis, choose the best location.
    *   If it fits perfectly into an existing category and sub-category, select that location.
    *   If it fits an existing main category but needs a new sub-category, decide on a logical name for the new sub-category.
    *   If the topic is completely new, decide on a logical name for a new main category and its first sub-category.
4.  **Remember Your Choice:** Keep the chosen category and sub-category names in your memory for the next steps.

### Step 2: Prepare Your Workspace

Create a private, temporary folder on the computer to work in. Name this folder based on the category you chose. All of your work will happen inside this space.

### Step 3: Process the Video

1.  **Download:** Use the provided web address to download the full video into your temporary workspace.
2.  **Cut into Clips:** Using the list of timestamps you were given, cut the downloaded video into many smaller, individual clips. Each clip should be saved as a separate file and be ready for fast playback on the web.

### Step 4: Store the Video Clips Online

Take all the individual clips you just created and upload them to the application's cloud storage. When you upload them, place them in a cloud folder that matches the category and sub-category you decided on in Step 1.

### Step 5: Collect the Web Addresses

After you upload each clip, the cloud storage will give you a unique public web address (a URL) for it. You must collect the web address for every single clip and keep them in the correct order.

### Step 6: Update the Library's Master List

This is the most critical step. You will now edit the master data file.

1.  **Locate the Section:** Find the correct category and sub-category in the data file. If you decided to create new ones, add them to the structure now.
2.  **Add the New Lesson:** Create a new entry for the video lesson. Add its title and description.
3.  **List the Clips:** Inside the new lesson's entry, create a list of all its clips. For each clip, write its title and paste the matching web address you collected in Step 5.
4.  **Save the File:** Save your changes to the master data file, making sure its structure remains correct.

### Step 7: Clean Up

Delete your temporary workspace and all the files inside it. This leaves the system clean. Finally, report that your mission was a success.

---

## 5. Understanding the Master List's Structure

The master data file you will edit is organized in a nested structure, like folders within folders. You must maintain this structure.

*   The file contains a list of **Categories**.
*   Each **Category** has a name and contains a list of **Subcategories**.
*   Each **Subcategory** has a name and contains a list of **Videos**.
*   Each **Video** has a title, a description, and contains a list of **Chapters**.
*   Each **Chapter** has a title and the final web address for its individual clip.