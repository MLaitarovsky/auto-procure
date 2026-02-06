from crewai import Agent, Task, Crew, Process

# Import the CLASSES
from app.ai.tools import CheckStockTool, CreateDraftOrderTool
from langchain_openai import ChatOpenAI

# 1. Instantiate the tools (Create objects from the classes)
check_stock = CheckStockTool()
create_order = CreateDraftOrderTool()

# 2. Define the Agent
procurement_agent = Agent(
    role="Supply Chain Analyst",
    goal="Monitor inventory and ensure no product goes out of stock.",
    backstory="""You are a veteran supply chain manager. 
  You are conservative and prefer to order early. 
  You must ALWAYS explain why you are ordering.""",
    verbose=True,
    allow_delegation=False,
    # Pass the INSTANCES here
    tools=[check_stock, create_order],
    llm=ChatOpenAI(model_name="gpt-4", temperature=0),
)

# 3. Define the Task
monitor_task = Task(
    description="""
  1. Check the inventory for low stock items using your 'Check Stock Levels' tool.
  2. If you find low stock items, group them by Vendor.
  3. For EACH vendor, use the 'Create Draft Order' tool to create a PO.
    - Calculate the quantity needed to reach 'max_stock_capacity'.
    - Provide a clear, one-sentence reasoning for the human approver.
  """,
    expected_output="A summary of the purchase orders created.",
    agent=procurement_agent,
)


# 4. The Execution Function
def run_procurement_cycle():
    crew = Crew(
        agents=[procurement_agent], tasks=[monitor_task], process=Process.sequential
    )

    result = crew.kickoff()
    return result
