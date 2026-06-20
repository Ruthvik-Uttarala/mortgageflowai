import unittest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from mortgageflowai import run_workflow_cells


class WorkflowCellTests(unittest.TestCase):
    def test_complex_file_gets_guided_review_without_losing_fairness(self):
        result = run_workflow_cells(
            {
                "income_type": "self-employed",
                "document_state": "incomplete",
                "verification_attempts": 2,
            }
        )

        self.assertEqual(result["decision"], "guided_review")
        self.assertIn("two-year income history", result["data_missing"])
        self.assertIn("Comparable files", result["fairness_rule"])
        self.assertEqual(len(result["cells"]), 4)


if __name__ == "__main__":
    unittest.main()
