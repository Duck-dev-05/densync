from sqlmodel import Session
from database import engine, create_db_and_tables
from models import AiFeedbackQueue

def seed():
    create_db_and_tables()
    with Session(engine) as session:
        existing = session.query(AiFeedbackQueue).first()
        if not existing:
            queue_items = [
                AiFeedbackQueue(task_id="img-8821", image_src="/test-defects/metal_gear_crack.jpg", prediction="Micro-fracture", confidence=64, date_str="10:42 AM", status="pending"),
                AiFeedbackQueue(task_id="img-8822", image_src="/test-defects/pcb_burnt_component.jpg", prediction="Solder bridge", confidence=58, date_str="09:15 AM", status="pending"),
                AiFeedbackQueue(task_id="img-8823", image_src="/test-defects/metal_pipe_leak.jpg", prediction="Condensation", confidence=42, date_str="Yesterday", status="pending"),
            ]
            for item in queue_items:
                session.add(item)
            session.commit()
            print("Successfully seeded AiFeedbackQueue.")
        else:
            print("Already seeded.")

if __name__ == "__main__":
    seed()
