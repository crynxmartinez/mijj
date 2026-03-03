# Seed Data

This folder contains scripts to populate the database with dummy data for testing and demonstration purposes.

## Usage

### Add Seed Data
```bash
npm run seed
```

This will create:
- 5 dummy projects with various statuses
- Monthly transactions for 2025 (income and expenses)
- Realistic construction project data

### Remove All Seed Data
```bash
npm run seed:clean
```

This will delete ALL projects and transactions from the database. **Use with caution!**

## Important Notes

- Seed data is tagged with a special identifier for easy cleanup
- All seed projects have names starting with "[DEMO]"
- Deleting this entire `seed` folder will NOT affect the database
- You must run `npm run seed:clean` to remove data from the database

## Data Generated

- **Projects**: 5 construction projects with different statuses
- **Transactions**: ~60 transactions spread across 2025
- **Budget Range**: ₱500,000 - ₱5,000,000 per project
- **Transaction Types**: Income and expenses with realistic categories
